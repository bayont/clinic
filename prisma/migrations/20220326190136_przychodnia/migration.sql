/*
  Warnings:

  - You are about to drop the column `reserverd` on the `Appointment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL,
    "doctorID" TEXT NOT NULL,
    "reserved" BOOLEAN NOT NULL DEFAULT false,
    "userID" TEXT,
    CONSTRAINT "Appointment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Appointment_doctorID_fkey" FOREIGN KEY ("doctorID") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("doctorID", "id", "time", "userID") SELECT "doctorID", "id", "time", "userID" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
