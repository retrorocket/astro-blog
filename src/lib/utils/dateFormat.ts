import { DateTime } from "luxon";
const dateFormat = (datetime: Date, format?: string) => {
  const dt = DateTime.fromISO(datetime.toISOString()).setZone("Asia/Tokyo");

  if (format) return dt?.toFormat(format);
  return dt?.toISO();
};

export default dateFormat;
