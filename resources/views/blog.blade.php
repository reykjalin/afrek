<x-layout>
	<main class="container">
		<h1>Blog</h1>

        <article>
            <header>
                <h2><a href="<?php echo route('blog.2024-h2-updates'); ?>">Update on progress as of the second half of 2024</a></h2>
                <small><b>Published: 2024-10-25</b></small>
            </header>
            An update on the progress made so far since going live with pre-alpha in 2024.
        </article>

        <article>
            <header>
                <h2><a href="<?php echo route('blog.introduction'); ?>">Introducing Afrek.app</a></h2>
                <small><b>Updated: 2024-02-01</b></small>
            </header>
            A brief overview of the motivations behind Afrek, as well as a rough roadmap for the future.
        </article>
	</main>
    <style>
        :root {
            --pico-font-size: 18px;
        }

        main.container {
            max-width: 760px;
            margin: auto;
        }

        article {
            border: 1px solid var(--pico-color-violet-600);

            & header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;

                & h2 {
                    margin: 0;
                    padding: 0;
                }
            }
        }
    </style>
</x-layout>
