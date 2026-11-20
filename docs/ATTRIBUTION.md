# Attribution & Forking

This project pays homage to the original demo work and subsequent contributions.

## Original work
The core ideas (session lengths, cleaning buffers, occupancy caps, staff rules, membership simulation, and phone-first UX) originated as a pitch for a private bathhouse spa booking flow. Catalog data was modeled from publicly available pages for demonstration only.

**Not affiliated** with any listed house or provider.

## Additional credits
- **gload / gforce logic**: The live calculation and physics-related logic (gforce / luve calc) traces back to an earlier source the author recalls as "emotion". This informed the hidden staff/admin routing and load-related features around occupancy and buffering.
- **Grok AI inspiration**: Many architectural choices, privacy-preserving patterns, multi-tenant generalization, and the overall marketplace evolution were informed by collaborative sessions with Grok.

## License
MIT. Fork freely. Keep this attribution file and the non-affiliation notice in README.md when redistributing.

## Upgrading a fork
1. Clone or fork the repo.
2. Check the root `VERSION` file for the branch version.
3. Sync `package.json` version if desired.
4. Run `npm install && npm run dev`.
5. Review `docs/SECURITY.md` and change demo codes before any production use.

See [README.md](../README.md) for layout and run instructions.
