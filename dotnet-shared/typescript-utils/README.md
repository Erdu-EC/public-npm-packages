# @erdu.dev/dotnet-typescript-utils

[![npm version](https://img.shields.io/npm/v/@erdu.dev/dotnet-typescript-utils.svg)](https://www.npmjs.com/package/@erdu.dev/dotnet-typescript-utils)
[![GitHub Packages](https://img.shields.io/badge/GitHub-Packages-181717.svg?logo=github)](https://github.com/orgs/Erdu-EC/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript types and utilities for .NET 8+ date, time, and value types.

This package provides **template literal types** and **runtime utility functions** that match the string formats used by .NET 8+ when serializing common value types.

## Installation

```bash
npm install @erdu.dev/dotnet-typescript-utils
```

## Quick Reference

| Export | Kind | Description |
|---|---|---|
| `ISODateOnlyString` | Type | Date-only string (`2026-02-02`) |
| `ISODateString` | Type | DateTime string with optional timezone |
| `DateTimeOffsetString` | Type | DateTime string with timezone offset |
| `GUIDString` | Type | Guid string (`8-4-4-4-12` format) |
| `TimeSpanString` | Type | TimeSpan string (`HH:MM:SS` format) |
| `TimeSpanComponents` | Interface | Parsed TimeSpan components |
| `isDateTimeString` | Function | Type guard for DateTime strings |
| `isDateOnlyString` | Function | Type guard for DateOnly strings |
| `isOffsetDateTime` | Function | Type guard for DateTimeOffset strings |
| `parseDateTime` | Function | Parse DateTime string to `Date` |
| `parseDateOnly` | Function | Parse DateOnly string to `Date` |
| `toDateTimeString` | Function | Convert `Date` to DateTime string |
| `toDateOnlyString` | Function | Convert `Date` to DateOnly string |
| `isGuidString` | Function | Type guard for Guid strings |
| `normalizeGuid` | Function | Normalize Guid to lowercase |
| `emptyGuid` | Function | Return empty Guid |
| `isGuidEmpty` | Function | Check if Guid is empty |
| `areGuidsEqual` | Function | Compare two Guids (case-insensitive) |
| `isTimeSpanString` | Function | Type guard for TimeSpan strings |
| `timeSpanToMilliseconds` | Function | Convert TimeSpan to milliseconds |
| `millisecondsToTimeSpan` | Function | Convert milliseconds to TimeSpan |
| `splitTimeSpan` | Function | Split TimeSpan into components |
| `addTimeSpans` | Function | Add two TimeSpans |
| `subtractTimeSpans` | Function | Subtract two TimeSpans |
| `multiplyTimeSpan` | Function | Multiply TimeSpan by scalar |
| `divideTimeSpan` | Function | Divide TimeSpan by scalar |
| `zeroTimeSpan` | Function | Return zero TimeSpan |
| `isTimeSpanZero` | Function | Check if TimeSpan is zero |

## Types

The package provides template literal types that match .NET 8+ serialization formats:

| Type | .NET Equivalent | Format |
|---|---|---|
| `ISODateOnlyString` | `DateOnly` | `2026-02-02` |
| `ISODateString` | `DateTime` | `2026-02-02T01:27:20.366626` |
| `DateTimeOffsetString` | `DateTimeOffset` | `2026-02-02T01:27:20.366+05:00` |
| `GUIDString` | `Guid` | `550e8400-e29b-41d4-a716-446655440000` |
| `TimeSpanString` | `TimeSpan` | `01:23:45.1234567` |

## Example

```typescript
import {
  isDateTimeString,
  parseDateTime,
  toDateTimeString,
  isGuidString,
  timeSpanToMilliseconds,
} from '@erdu.dev/dotnet-typescript-utils';

// DateTime validation and conversion
isDateTimeString("2026-02-02T01:27:20Z");        // true
toDateTimeString(new Date());                     // "2026-11-01T19:14:30.123Z"
parseDateTime("2026-02-02T01:27:20Z");           // Date object

// Guid validation
isGuidString("550e8400-e29b-41d4-a716-446655440000");  // true

// TimeSpan conversion
timeSpanToMilliseconds("01:23:45");              // 5025000
```

## License

MIT
