-- Add FK + cascade + index on Fine.studentId -> users.id.
-- Companion to schema.prisma change that promotes the relation from an
-- unconstrained string to a real foreign key.

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Fine_studentId_status_idx" ON "Fine"("studentId", "status");
