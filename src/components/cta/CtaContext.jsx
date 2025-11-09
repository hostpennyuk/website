import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CtaModalContext = createContext({ open: false, openModal: () => {}, closeModal: () => {} });

export const CtaModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, openModal, closeModal }), [open, openModal, closeModal]);

  return (
    <CtaModalContext.Provider value={value}>
      {children}
    </CtaModalContext.Provider>
  );
};

export const useCtaModal = () => useContext(CtaModalContext);

export default CtaModalContext;
