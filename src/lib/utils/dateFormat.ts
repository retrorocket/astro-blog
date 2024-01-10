import { settings } from "@config/config.json";
import { DateTime } from "luxon";
const dateFormat = (datetime: Date, format?: string) => {
  const dt = DateTime.fromJSDate(datetime, { zone: settings.timezone });

  if (format) return dt?.toFormat(format);
  return dt?.toISO();
};

export default dateFormat;
