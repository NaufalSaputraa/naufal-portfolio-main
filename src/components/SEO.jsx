import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, name, type, image, url }) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* End standard metadata tags */}
            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Naufal Saputra Portfolio" />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            {/* End Twitter tags */}

            <meta name="author" content={name} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
};

SEO.defaultProps = {
    title: 'Naufal Saputra | Mobile & Cloud Engineer',
    description: 'Portfolio of Naufal Saputra, an Informatics Engineering student specializing in Mobile Dev, Cloud Engineering, and Cyber Security.',
    keywords: 'Naufal Saputra, Mobile Engineer, Cloud Engineer, Cyber Security, React, Portfolio',
    name: 'Naufal Saputra',
    type: 'website',
    image: 'https://github.com/NaufalSaputraa.png', // Fallback to GitHub avatar
    url: typeof window !== 'undefined' ? window.location.href : '',
};

export default SEO;
