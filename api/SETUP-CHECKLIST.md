# Apply this bundle to your existing NestJS `api` folder

1. Copy `prisma/schema.prisma` and `prisma/seed.ts` into `api/prisma/`.
2. Copy `prisma.config.ts` into `api/`.
3. Copy `src/prisma/prisma.service.ts` and `src/prisma/prisma.module.ts` into `api/src/prisma/`.
4. Copy `.env.example` to `api/.env.example`; make a private `api/.env` and fill in your Render External Database URL.
5. Merge the three Prisma scripts from the root README into the existing `api/package.json`.
6. Install dependencies from the root README.
7. Import `PrismaModule` in `api/src/app.module.ts`:

   ```ts
   import { PrismaModule } from './prisma/prisma.module';

   @Module({
     imports: [PrismaModule],
     // keep the existing controllers and providers
   })
   export class AppModule {}
   ```

8. Run from `api/`:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

Do not commit `api/.env`. Commit `.env.example` only.
