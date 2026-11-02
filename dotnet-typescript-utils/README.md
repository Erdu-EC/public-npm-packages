# dotnet-typescript-utils

TypeScript types and utilities for .NET Core 10 date, time, and value types.

This package provides **template literal types** and **runtime utility functions** that match the string formats used by .NET Core 10 when serializing common value types.

## Installation

```bash
npm install dotnet-typescript-utils
```

## Types

### Date and Time

| Type | .NET Equivalent | Format |
|---|---|---|
| `ISODateOnlyString` | `DateOnly` (.NET 8+) | `2026-02-02` |
| `ISODateString` | `DateTime` | `2026-02-02T01:27:20.366626` |
| `DateTimeOffsetString` | `DateTimeOffset` | `2026-02-02T01:27:20.366+05:00` |

`ISODateString` supports three variants:

- **Local / Unspecified** — No timezone offset: `"2026-02-02T01:27:20.366626"`
- **Offset** — With timezone offset: `"2026-02-02T01:27:20.366626+05:30"`
- **UTC** — With `Z` suffix: `"2026-02-02T01:27:20Z"`

`DateTimeOffsetString` is a subtype of `ISODateString` that always includes a timezone offset (`+HH:MM` or `-HH:MM`). Use `isOffsetDateTime()` to check for this variant at runtime.

### Other Types

| Type | .NET Equivalent | Format |
|---|---|---|
| `GUIDString` | `Guid` | `550e8400-e29b-41d4-a716-446655440000` |
| `TimeSpanString` | `TimeSpan` | `01:23:45.1234567` |

`GUIDString` validates the 8-4-4-4-12 structure at compile time and accepts both lowercase and uppercase hex digits. Use `isGuidString()` for runtime validation.

`TimeSpanString` supports:
- Hours, minutes, seconds: `"01:23:45"`
- Fractional seconds: `"01:23:45.1234567"`
- Days component: `"7:01:23:45"`
- Negative values: `"-01:23:45"`

## Utilities

### DateTime & DateOnly

```typescript
import {
  isDateTimeString,
  isDateOnlyString,
  isOffsetDateTime,
  parseDateTime,
  parseDateOnly,
  toDateTimeString,
  toDateOnlyString,
} from 'dotnet-typescript-utils';

// Type guards
isDateTimeString("2026-02-02T01:27:20Z");          // true
isDateTimeString("2026-02-02T01:27:20+05:30");     // true
isDateOnlyString("2026-02-02");                     // true
isOffsetDateTime("2026-02-02T01:27:20+05:30");     // true
isOffsetDateTime("2026-02-02T01:27:20Z");          // false

// Convert Date to .NET strings
toDateTimeString(new Date());                       // "2026-11-01T19:14:30.123Z" (UTC)
toDateOnlyString(new Date());                       // "2026-11-01" (local date)

// Parse .NET strings to Date
parseDateTime("2026-02-02T01:27:20Z");             // Date (UTC)
parseDateTime("2026-02-02T01:27:20+05:30");        // Date (converted to UTC)
parseDateTime("2026-02-02T01:27:20.366626");       // Date (treated as UTC)
parseDateOnly("2026-02-02");                        // Date (local midnight)
```

### Guid

```typescript
import {
  isGuidString,
  normalizeGuid,
  emptyGuid,
  isGuidEmpty,
  areGuidsEqual,
} from 'dotnet-typescript-utils';

// Validate
isGuidString("550e8400-e29b-41d4-a716-446655440000");  // true

// Normalize to lowercase
normalizeGuid("550E8400-E29B-41D4-A716-446655440000");  // "550e8400-e29b-41d4-a716-446655440000"

// Empty GUID
emptyGuid();                                            // "00000000-0000-0000-0000-000000000000"
isGuidEmpty("00000000-0000-0000-0000-000000000000");   // true

// Compare two GUIDs (case-insensitive)
areGuidsEqual("550E8400-E29B-41D4-A716-446655440000", "550e8400-e29b-41d4-a716-446655440000");  // true
```

### TimeSpan

```typescript
import {
  isTimeSpanString,
  timeSpanToMilliseconds,
  millisecondsToTimeSpan,
  splitTimeSpan,
  addTimeSpans,
  subtractTimeSpans,
  multiplyTimeSpan,
  divideTimeSpan,
  zeroTimeSpan,
  isTimeSpanZero,
} from 'dotnet-typescript-utils';

// Validate
isTimeSpanString("01:23:45.1234567");  // true

// Convert to milliseconds
timeSpanToMilliseconds("01:23:45");         // 5025000
timeSpanToMilliseconds("7:01:23:45");       // 609825000
timeSpanToMilliseconds("-01:23:45");        // -5025000

// Convert from milliseconds
millisecondsToTimeSpan(5025000);            // "01:23:45.000"
millisecondsToTimeSpan(609825000);          // "7:01:23:45.000"

// Split into components
const { days, hours, minutes, seconds, milliseconds, negative } =
  splitTimeSpan("7:01:23:45.123");
// days=7, hours=1, minutes=23, seconds=45, milliseconds=123, negative=false

// Convert back to string using toString()
splitTimeSpan("-01:23:45").toString();      // "-01:23:45.000"

// Arithmetic — accepts both TimeSpanString and TimeSpanComponents
addTimeSpans("01:23:45", "02:00:00");       // "03:23:45.000"
subtractTimeSpans("03:23:45", "02:00:00");  // "01:23:45.000"
multiplyTimeSpan("01:00:00", 3);            // "03:00:00.000"
divideTimeSpan("03:00:00", 3);              // "01:00:00.000"

// Arithmetic with TimeSpanComponents
const a = splitTimeSpan("01:23:45");
const b = splitTimeSpan("02:00:00");
addTimeSpans(a, b);                         // "03:23:45.000"
subtractTimeSpans(a, "00:30:00");           // "00:53:45.000"
multiplyTimeSpan(a, 2);                     // "02:47:30.000"

// Zero TimeSpan
zeroTimeSpan();                              // "00:00:00.000"
isTimeSpanZero("00:00:00.000");             // true
isTimeSpanZero({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, negative: false }); // true
```

## Working with JavaScript `Date`

Use `toDateTimeString()` / `toDateOnlyString()` to convert `Date` objects to UTC strings, and `parseDateTime()` / `parseDateOnly()` to parse server responses back to `Date` objects.

```typescript
import { toDateTimeString, toDateOnlyString, parseDateTime, parseDateOnly } from 'dotnet-typescript-utils';

// Send to server
const date = new Date();
toDateTimeString(date);         // "2026-11-01T19:30:00.000Z"
toDateOnlyString(date);         // "2026-11-01"

// Receive from server
parseDateTime("2026-11-01T19:30:00.000Z");   // Date object
parseDateOnly("2026-11-01");                  // Date at midnight (local time)
```

For local display formatting, use the native `Date` methods (`getFullYear`, `getMonth`, etc.) or `Intl.DateTimeFormat`.

## Type-Safe Usage

```typescript
import { ISODateString, GUIDString, toDateTimeString, isDateTimeString } from 'dotnet-typescript-utils';

// Type-safe function parameters
function createEvent(date: ISODateString, organizerId: GUIDString) {
  // ...
}

// Valid calls
createEvent("2026-02-02T01:27:20Z", "550e8400-e29b-41d4-a716-446655440000");

// Type error: invalid date format
createEvent("02/02/2026", "550e8400-e29b-41d4-a716-446655440000");

// Working with UTC dates
function logWithTimestamp(): ISODateString {
  return toDateTimeString(new Date());
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Type check
npm run typecheck

# Clean build output
npm run clean
```

## License

MIT
