import prisma from './prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==========================================
// FLIGHT ROUTES (Protejate de Token)
// ==========================================

export const createFlight = async (req, res) => {
  try {
    const { date, ...restOfData } = req.body;
    
    // ✨ Luăm ID-ul din token-ul decriptat de middleware, NU din req.body
    const userId = req.user.id;

    const newFlight = await prisma.flight.create({
      data: {
        ...restOfData,
        date: new Date(date),
        userId: userId // Asociem zborul utilizatorului logat
      },
      include: {
        airline: true,
        user: true
      }
    });

    res.status(201).json(newFlight);
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ error: "Failed to create flight. Ensure airlineId exists." });
  }
};


export const getFlights = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status } = req.query; 

    // ✨ Luăm ID-ul din token
    const userId = req.user.id; 

    const whereClause = { userId: userId };
    if (status) whereClause.status = status;

    const [flights, totalCount] = await Promise.all([
      prisma.flight.findMany({
        skip,
        take: limit,
        where: whereClause, 
        orderBy: { date: 'desc' }, 
        include: { airline: true } 
      }),
      prisma.flight.count({ where: whereClause }) 
    ]);

    res.status(200).json({
      data: flights,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalFlights: totalCount
    });
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
};


export const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const flight = await prisma.flight.findUnique({
      where: { id },
      include: { airline: true, user: true }
    });

    if (!flight) return res.status(404).json({ error: "Flight not found" });
    
    // ✨ Măsură extra de securitate: Asigură-te că zborul aparține utilizatorului logat!
    if (flight.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized access to this flight" });
    }

    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flight details" });
  }
};


export const updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ✨ Verificăm întâi dacă zborul îi aparține înainte să-l lăsăm să-l modifice
    const existingFlight = await prisma.flight.findUnique({ where: { id } });
    if (!existingFlight) return res.status(404).json({ error: "Flight not found" });
    if (existingFlight.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized to update this flight" });
    }

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const updatedFlight = await prisma.flight.update({
      where: { id },
      data: updateData,
      include: { airline: true }
    });

    res.status(200).json(updatedFlight);
  } catch (error) {
    res.status(500).json({ error: "Failed to update flight" });
  }
};


export const deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;

    // ✨ Verificăm dacă are voie să șteargă
    const existingFlight = await prisma.flight.findUnique({ where: { id } });
    if (!existingFlight) return res.status(404).json({ error: "Flight not found" });
    if (existingFlight.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized to delete this flight" });
    }

    await prisma.flight.delete({
      where: { id }
    });
    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete flight" });
  }
};


export const getStats = async (req, res) => {
  try {
    // ✨ Luăm ID-ul din token
    const userId = req.user.id;

    const flights = await prisma.flight.findMany({
      where: { userId: userId } 
    });

    let totalMinutes = 0;

    for (const flight of flights) {
      if (flight.departureTime && flight.arrivalTime) {
        const [dh, dm] = flight.departureTime.split(':').map(Number);
        const [ah, am] = flight.arrivalTime.split(':').map(Number);
        let flightDurationMinutes = (ah * 60 + am) - (dh * 60 + dm);
        if (flightDurationMinutes < 0) flightDurationMinutes += 1440; 
        totalMinutes += flightDurationMinutes;
      }
    }

    const totalFlightHours = Math.floor(totalMinutes / 60);
    const totalFlightMinutes = totalMinutes % 60;

    res.json({ totalFlightHours, totalFlightMinutes });

  } catch (error) {
    console.error("Failed to calculate stats:", error);
    res.status(500).json({ error: "Could not calculate flight stats" });
  }
};

// ==========================================
// AUTHENTICATION & PUBLIC ROUTES
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName, license } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(), 
        password: hashedPassword, 
        fullName,
        license
      }
    });

    delete newUser.password; 
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "A user with this email already exists." });
    }
    res.status(500).json({ error: "Failed to register user." });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() } 
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    delete user.password;

    res.status(200).json({
      user: user,
      token: token
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error during login." });
  }
};

export const getAirlines = async (req, res) => {
  try {
    const airlines = await prisma.airline.findMany({
      orderBy: { name: 'asc' } 
    });
    res.status(200).json(airlines);
  } catch (error) {
    console.error("Error fetching airlines:", error);
    res.status(500).json({ error: "Failed to fetch airlines" });
  }
};