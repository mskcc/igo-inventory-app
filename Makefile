deploy:
	cd ./frontend && npm run build && cd - && \
	cd ./backend && npm run clean && cp -rf ../frontend/build ./public && cd - && \
	rsync -a ./backend/ igo:deployments/run-planner
