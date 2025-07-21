export const PluginFeedFacebook = () => {
    return (
        <iframe
            className="bg-gray rounded-md"
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fbaalak.cv&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
            width="380"
            height="500"
            style={{ border: "none", overflow: "hidden" }}
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
        </iframe>
    );
};