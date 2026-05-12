-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'bytes_officer', 'librarian', 'faculty_adviser', 'chairperson', 'dean');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('pending', 'approved', 'denied');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'student',
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "sex" TEXT,
    "birthdate" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "contact_number" TEXT,
    "course" TEXT,
    "college" TEXT,
    "department" TEXT,
    "password_hash" TEXT NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'pending',
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "denial_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_school_id_key" ON "users"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
