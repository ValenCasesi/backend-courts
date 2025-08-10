-- DropForeignKey
ALTER TABLE "public"."MatchParticipant" DROP CONSTRAINT "MatchParticipant_userId_fkey";

-- AlterTable
ALTER TABLE "public"."MatchParticipant" ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userLastName" TEXT,
ADD COLUMN     "userName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."MatchParticipant" ADD CONSTRAINT "MatchParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
