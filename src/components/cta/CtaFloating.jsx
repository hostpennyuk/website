import CtaButton from './CtaButton';

const CtaFloating = () => {
  return (
    <div className="fixed right-4 bottom-24 lg:bottom-6 z-40">
      {/* Desktop */}
      <div className="hidden sm:block">
        <CtaButton />
      </div>
      {/* Mobile - smaller pill above sticky quick actions */}
      <div className="sm:hidden">
        <CtaButton className="px-4 py-2 text-sm rounded-full" label="Start Your Project" />
      </div>
    </div>
  );
};

export default CtaFloating;
