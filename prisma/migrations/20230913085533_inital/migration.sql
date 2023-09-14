-- CreateTable
CREATE TABLE "Cabinet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT DEFAULT '0.0.0.0',
    "type" TEXT DEFAULT 'unknown',
    "slots" INTEGER NOT NULL,
    "qrCode" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "emptySlots" INTEGER NOT NULL,
    "busySlots" INTEGER NOT NULL,
    "shopId" INTEGER,
    "signal" TEXT,
    "posDeviceId" INTEGER
);

-- CreateTable
CREATE TABLE "Battery" (
    "batteryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cabinetId" INTEGER,
    "slotNum" INTEGER,
    "vol" INTEGER NOT NULL,
    CONSTRAINT "Battery_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batteryId" INTEGER NOT NULL,
    "cabinetId" INTEGER NOT NULL,
    "dailyMaxPrice" INTEGER,
    "freeMinutes" INTEGER,
    "borrowTime" DATETIME NOT NULL,
    "price" INTEGER,
    "currency" TEXT DEFAULT 'sgd',
    "deviceType" TEXT DEFAULT 'unknown',
    "priceMinute" TEXT,
    "callbackUrl" TEXT,
    "borrowSlot" INTEGER NOT NULL,
    "returnTime" DATETIME,
    "borrowStatus" INTEGER NOT NULL,
    "deposit" INTEGER,
    CONSTRAINT "Order_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery" ("batteryId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
