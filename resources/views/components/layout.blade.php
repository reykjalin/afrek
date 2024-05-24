<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>{{ $title ?? 'Afrek' }}</title>

		@vite([
			'resources/css/style.css',
			'resources/js/src/entrypoints/header.ts',
			'resources/js/src/entrypoints/footer.ts',
			'resources/js/src/entrypoints/login.ts',
			'resources/js/src/entrypoints/register.ts',
			'resources/js/src/entrypoints/tasks.ts',
		])
	</head>
	<body>
		<header id="header"></header>

		{{ $slot }}

		<footer id="footer"></footer>
	</body>
</html>
