# Retrospective: Farm2Table Marketplace Build

This project was a strong example of how a product can move quickly from idea to working experience when planning, implementation, and deployment concerns are handled collaboratively. Across the cart system, admin dashboard, delivery tracking flow, AI review workflow, and deployment hardening, the team learned a great deal about balancing speed with reliability. The outcome was not just a feature-complete marketplace prototype, but also a more disciplined approach to how modern web applications should be built and shipped.

## 1. What the planning phase saved us from

The planning phase was valuable because it reduced ambiguity before implementation began. By defining the key user journeys early—shopping, checkout, admin inventory management, and shipment tracking—we avoided building isolated features that did not fit together as a coherent product. This saved us from a common trap in MVP development: adding features that look useful in isolation but create inconsistent UX and architecture later.

Planning also helped us identify the most important technical constraints up front. For example, we knew the app would rely on Prisma and a PostgreSQL-backed schema, which meant we had to think carefully about data access patterns, server/client boundaries, and static rendering. That foresight prevented us from building pages that assumed database access would always be available. It also helped us decide early that the project needed graceful fallbacks, especially for the public storefront and tracking route, so the app would remain usable even during deployment or connectivity challenges.

Without that planning stage, we likely would have ended up with disconnected screens, duplicate logic, and brittle deployment behavior. The planning phase saved us time in debugging later, because many decisions about structure and intent were already captured before code started piling up.

## 2. Where AI got things wrong, and how we corrected them

AI-assisted development was useful, but it was not flawless. Some of the biggest issues came from assumptions about the environment and the framework rather than from the core product requirements. One recurring problem was Prisma-related type errors. For example, the project initially hit issues around Prisma Client typing and the generated client not being available early enough in the build pipeline. The AI-generated approach often assumed the Prisma client was already ready, but in practice the project needed explicit generation steps and careful handling of the generated types.

Another major area of friction was Vercel deployment. The build initially failed because the Prisma-backed pages were trying to access the database during static generation, and the deployment environment could not reach the database server. That led to errors during page generation for routes like / and /admin. The correction was not just to change code, but to change the rendering strategy. We moved those pages to dynamic rendering and introduced defensive fallbacks so that the app would render even when database connectivity was unavailable. That was a critical lesson: build environments are not the same as local development environments, and server-side data fetching must be treated as potentially unreliable.

There were also issues around the shape of Prisma query results. The app’s home page and admin page needed to handle the relation data from Prisma carefully, especially when using include statements. TypeScript errors surfaced because the compiler inferred the base model type rather than the relation-enhanced shape. The correction involved making the data shape explicit and ensuring the app handled fallbacks gracefully. In other words, the AI often got the feature behavior right, but it underestimated the importance of type precision and deployment constraints.

The good news is that each of these issues became an opportunity to improve the app. The fixes were not cosmetic—they strengthened the project’s resilience, made the build more reliable, and improved the user experience in failure scenarios. That makes the debugging process feel less like cleanup and more like real product hardening.

## 3. What we would change in our process next time

If we were to repeat this project, we would make a few process changes to reduce friction and accelerate delivery without sacrificing quality.

First, we would define deployment constraints earlier. In a Next.js app with Prisma and a database, build-time assumptions must be tested against production behavior from the start. That means checking not just whether the app works locally, but whether routes can build successfully in a serverless or preview environment with limited database access. A short “deployment checklist” at the beginning of the project would have prevented several of the later issues.

Second, we would introduce stricter type-safety expectations sooner. Prisma-generated types are powerful, but they require careful use. We should have been more deliberate about the shapes of data returned from queries, especially for pages that include relations. A habit of declaring fallback types explicitly and validating them before moving to the next feature would have reduced build interruptions.

Third, we would build with resilience in mind from day one. The ability to show demo content when the database is down is not a band-aid; it is a meaningful product quality requirement for any early-stage deployment. The mock fallback data we introduced later should have been part of the initial plan, especially for storefront pages and public routes.

Finally, we would keep a tighter loop between implementation and verification. After each major feature, the team should verify not just local rendering but also build output and route behavior. This would have caught deployment mismatches sooner and made the feedback loop shorter.

## Closing reflection

Overall, this project demonstrated that rapid feature delivery is possible when the team stays grounded in user experience and product intent. It also showed that AI-assisted development can accelerate implementation significantly, but it still requires human judgment, especially when the app moves from local success to production reliability. The lessons from Prisma errors, deployment failures, and dynamic rendering challenges are valuable because they make the next iteration more robust. The project is now stronger not only as a marketplace demo, but also as a case study in how to build modern full-stack features with more confidence.
