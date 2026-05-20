-- Workflow expansion: 5-stage -> 9-stage clearance pipeline.
-- Adds Admin / Cursor / Department / Enrolling Faculty roles + per-org fee links.

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'admin';
ALTER TYPE "Role" ADD VALUE 'cursor_org';
ALTER TYPE "Role" ADD VALUE 'department_org';
ALTER TYPE "Role" ADD VALUE 'enrolling_faculty';

-- AlterEnum
ALTER TYPE "StageRole" ADD VALUE 'admin';
ALTER TYPE "StageRole" ADD VALUE 'cursor_org';
ALTER TYPE "StageRole" ADD VALUE 'department_org';
ALTER TYPE "StageRole" ADD VALUE 'enrolling_faculty';

-- AlterTable
ALTER TABLE "Fee" ADD COLUMN "orgRole" "StageRole";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "orgRole" "StageRole";
