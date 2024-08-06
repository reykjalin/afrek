<x-layout>
	<main class="container">
		<h1>Blog</h1>

        <article>
            <header>
                <h2><a href="/blog/introduction">Introducing Afrek.app</a></h2>
                <b>Updated: 2024-02-01</b>
            </header>
            A brief overview of the motivations behind Afrek, as well as a rough roadmap for the future.
        </article>
	</main>
    <style>
        article {
            border: 1px solid var(--pico-color-violet-600);
            max-width: 760px;
            margin: auto;

            & header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;

                & h2 {
                    margin: 0;
                    padding: 0;
                }
            }
        }
    </style>
</x-layout>
