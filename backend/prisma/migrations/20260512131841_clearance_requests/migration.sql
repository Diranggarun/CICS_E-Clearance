-- CreateEnum
CREATE TYPE "ClearanceStatus" AS ENUM ('pending', 'approved', 'denied', 'completed');

-- CreateEnum
CREATE TYPE "StageRole" AS ENUM ('bytes_officer', 'librarian', 'faculty_adviser', 'chairperson', 'dean');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('pending', 'approved', 'denied');

-- CreateTable
CREATE TABLE "clearance_requests" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "status" "ClearanceStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "clearance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clearance_stages" (
    "id" TEXT NOT NULL,
    "clearance_request_id" TEXT NOT NULL,
    "role" "StageRole" NOT NULL,
    "status" "StageStatus" NOT NULL DEFAULT 'pending',
    "approver_id" TEXT,
    "reason" TEXT,
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clearance_stages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clearance_requests_reference_no_key" ON "clearance_requests"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "clearance_stages_clearance_request_id_role_key" ON "clearance_stages"("clearance_request_id", "role");

-- AddForeignKey
ALTER TABLE "clearance_requests" ADD CONSTRAINT "clearance_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance_stages" ADD CONSTRAINT "clearance_stages_clearance_request_id_fkey" FOREIGN KEY ("clearance_request_id") REFERENCES "clearance_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance_stages" ADD CONSTRAINT "clearance_stages_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
