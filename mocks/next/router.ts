export function useRouter() {
  return {
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: () => {},
    replace: () => {},
    reload: () => {},
    back: () => {},
    prefetch: () => {},
    beforePopState: () => {},
    events: {
      on: () => {},
      off: () => {},
      emit: () => {},
    },
    isFallback: false,
    isReady: true,
    isPreview: false,
  };
}