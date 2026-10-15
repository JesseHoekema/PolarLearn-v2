// PolarLearn: A free and open-source learning platform.
// Copyright(C) 2024-2026 PolarNL Group
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { describe, expect, it } from "vitest";
import { createLearnStore } from "~/routes/app/session/store";
import { formatDuration } from "~/lib/learn";

describe("formatDuration", () => {
  it("formats minutes and seconds", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(75)).toBe("1:15");
  });

  it("includes hours when needed", () => {
    expect(formatDuration(3725)).toBe("1:02:05");
  });
});

describe("learn session timer", () => {
  const queue = [{ id: "q1", type: "test" as const, question: "een", answer: ["one"] }];

  it("resumes from the stored time and stops when paused", () => {
    const store = createLearnStore({ listId: "list", queue, timeSpent: 90 });

    store.getState().pauseTimer();
    expect(store.getState().getElapsedSeconds()).toBe(90);
    expect(store.getState().timerStartedAt).toBeNull();

    store.getState().resumeTimer();
    expect(store.getState().timerStartedAt).not.toBeNull();
  });

  it("stops the timer when the session completes", () => {
    const store = createLearnStore({ listId: "list", queue, timeSpent: 10 });

    store.getState().onCorrectAnswer("q1", "one");
    expect(store.getState().isComplete).toBe(true);
    expect(store.getState().timerStartedAt).toBeNull();

    store.getState().resumeTimer();
    expect(store.getState().timerStartedAt).toBeNull();
  });
});
