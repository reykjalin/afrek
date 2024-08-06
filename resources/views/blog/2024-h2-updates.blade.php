<x-layout>
	<main class="container">
        <p><a href="<?php echo route('blog'); ?>">&larr; Back to blog</a></p>

        <h1>Update on progress as of H2 2024</h1>
        <p><small><b>Published: 2024-xx-xx</b></small></p>

        <p>It's been a while since the introduction blog post, so I thought it was time for a little update!</p>

        <h2>Quick Overview</h2>

        <h3>New features</h3>

        <ul>
            <li>Tags and tag based sorting</li>
            <li>List of completed tasks</li>
            <li>Task search</li>
        </ul>

        <h3>Changes</h3>

        <ul>
            <li>Calendar-based scheduling will not be implemented. Focus on task stacks instead.</li>
            <li>Rewrite using Laravel and Svelte instead of Phoenix and LiveView.</li>
            <li>New layout!</li>
        </ul>

        <h2>How is Afrek coming along?</h2>

        <p>
            Rework using Laravel and Svelte instead of Phoenix and LiveView.
            LiveView has limitations in UI interactions that made it difficult to make highly responsive UIs, particularly when it came to drag and drop and animations.
            PHP (and thus Laravel) is also easier to deploy on any service, so it'll be easier to find good hosting.
            Looking forward it'll also be easier for others to self-host if they'd like.
        </p>

        <p>
            Re-organized the UI around a 2 column layout that fills up the screen.
            The aim is to emphasize that the task description itself is all in the details instead of just the title.
            Afrek is also for taking notes, not just a todo list.
        </p>

        <p>
            Aim for rich text editing in task details.
            Ideally some smart blocks, such as interactive checklists, WYSIWYG code blocks, and the like.
        </p>

        <p>
            Pivoted away from calendar-based scheduling to a more free-form approach based around task "stacks".
            In essence: group tasks into stacks, focus on one stack at a time, with an optional timer if you'd like.
        </p>

        <p>Aim for a paid beta in before H2 2025.</p>

        <p>Going for as simple as possible, while still retaining all the features I want.</p>
    </main>

    <style>
        :root {
            --pico-font-size: 18px;
        }

        main.container {
            max-width: 760px;
            margin: auto;
        }
    </style>
</x-layout>
