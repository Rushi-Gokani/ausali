import { useEffect } from 'react';
import HomePackageParallax from '../components/HomePackageParallax';
import HomePackageOverview from '../components/HomePackageOverview';
import HomePackageIncludes from '../components/HomePackageIncludes';

function HomePackagePage() {
  useEffect(() => {
    document.title = 'Home Package | AUSALI SOLUTIONS';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HomePackageParallax />
      <HomePackageOverview onPlanPackage={() => {
        const contactSection = document.getElementById('contact') || document.querySelector('footer');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }} />
      <HomePackageIncludes />
    </>
  );
}

export default HomePackagePage;
