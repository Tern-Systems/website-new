const MapEmbed = () => (
  <iframe
    className={'w-full h-full shadow-md'}
    src={'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24175.062720483192!2d-74.01397335601076!3d40.75538323555057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ffbda86021%3A0xb007bfa8c91c72a5!2s1120%20Avenue%20of%20the%20Americas%2C%20New%20York%2C%20NY%2010036%2C%20USA!5e0!3m2!1sen!2sph!4v1712345678901&z=12'}
    allowFullScreen
    loading={'lazy'}
  />
);

export default MapEmbed;