## Next Task

**MVP-3: Render Orchestration & Output**

### Resume Point
MVP-2 (Dashboard & Template Experience) is 100% complete. We successfully wired up the Create Short UI wizard. The template API is live. The AI Generator returns structured JSON script scenes. The ElevenLabs API handles voice synthesis. The UI incorporates the `UploadZone` and `VideoPreview`. The final step successfully calls `/api/v1/projects` and `/api/v1/render-queue/jobs` to kick off the render process.

### MVP-3 — Render Orchestration & Output
- Finalize the Render Queue WebSocket connection in the Create Short wizard to listen for live progress events.
- Display the final downloadable MP4 URL upon job completion.
- Ensure all worker orchestration processes properly pick up the API-submitted render job.

### Last Completed File
`apps/web/src/app/(dashboard)/create/page.tsx`

### Do Not Regenerate
Everything from earlier phases, including enterprise modules.
