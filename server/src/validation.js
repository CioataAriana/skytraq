import { z } from 'zod'; 

const optionalString = z.string().optional().or(z.literal(""));

const flightSchema = z.object({
  flightNumber: z.string().min(2),
  date: z.string().min(1),
  origin: z.string().length(4),
  destination: z.string().length(4),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
  
  airlineId: z.string().min(1), 
  userId: z.string().min(1),    

  aircraft: optionalString,
  role: z.enum(["PIC", "Co-Plt", "Instr", "Dual"]),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  takeoffDayNight: optionalString,
  takeoffFuel: optionalString,
  takeoffWeight: optionalString,
  takeoffPerform: optionalString,
  landingDayNight: optionalString,
  landingFuel: optionalString,
  landingWeight: optionalString,
  landingPerform: optionalString,
  notes: optionalString
});

export const validateFlight = (req, res, next) => {
  const result = flightSchema.safeParse(req.body);
  if (!result.success) {
    console.error("VALIDATION REJECTED DATA:", result.error.format());
    return res.status(400).json({ errors: result.error.format() });
  }
  
  req.body = result.data;
  next();
};