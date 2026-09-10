interface RateFields {
  rateHour?: string;
  rateDay?: string;
  rateOneoff?: string;
}

// Combines whichever rate fields are set into one display string; undefined if none are.
export function formatRate({
  rateHour,
  rateDay,
  rateOneoff,
}: RateFields): string | undefined {
  const parts: string[] = [];
  if (rateHour) parts.push(`${rateHour}/hour`);
  if (rateDay) parts.push(`${rateDay}/day`);
  if (rateOneoff) parts.push(rateOneoff);
  return parts.length ? parts.join(" · ") : undefined;
}
