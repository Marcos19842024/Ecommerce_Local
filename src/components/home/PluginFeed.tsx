export const PluginFeed = () => {
    return (
        <div className='my-32'>
            <div id="fb-root"></div>
            <script
                async defer crossOrigin="anonymous"
                src="https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v23.0">
            </script>
            <div
                className="fb-page"
                data-href="https://www.facebook.com/baalak.cv"
                data-tabs="timeline"
                data-width=""
                data-height=""
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true">
                <blockquote
                    cite="https://www.facebook.com/baalak.cv"
                    className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/baalak.cv">Baalak&#039;</a>
                </blockquote>
            </div>
        </div>
    );
};