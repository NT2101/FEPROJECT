  // material-ui
  import logo from '../../assets/images/logo-utt.png'; // Update the path as necessary

  /**
   * if you want to use image instead of <svg> uncomment following.
   *
   * import logoDark from 'assets/images/logo-dark.svg';
   * import logo from 'assets/images/logo.svg';
   *
   */

  // ==============================|| LOGO SVG ||============================== //

  const Logo = () => {

    return (
      /**
       * if you want to use image instead of svg uncomment following, and comment out <svg> element.
       *
       * <img src={logo} alt="Mantis" width="100" />
       *
       */
      <>
      <img src={logo} alt="Logo" width="100" />
    </>
    );
  };

  export default Logo;
