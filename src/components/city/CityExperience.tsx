import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Pause,
  Play,
  X,
} from 'lucide-react';
import type { Dictionary, Locale } from '../../i18n';
import { cityReducer, districts, initialCity } from './model';
import LibraryExperience from './LibraryExperience';
import '../../styles/city.css';

const Scene = lazy(() => import('./CityScene'));
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CityExperience({
  lang,
  text,
}: {
  lang: Locale;
  text: Dictionary['city'];
}) {
  const [state, dispatch] = useReducer(cityReducer, initialCity);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [motion, setMotion] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);
  const [packet, setPacket] = useState(false);
  const root = useRef<HTMLElement>(null);
  const panelTitle = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (state.selected !== null) {
      panelTitle.current?.focus({ preventScroll: true });
      root.current?.scrollIntoView({
        behavior: reduced ? 'instant' : 'smooth',
        block: 'start',
      });
    }
  }, [state.selected, reduced]);
  const districtButtons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    setMounted(true);
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    let visible = true;
    const visibility = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visibility();
    });
    if (root.current) observer.observe(root.current);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      preference.removeEventListener('change', update);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  const home = () => {
    const index = state.selected;
    dispatch({ type: 'home' });
    if (index !== null)
      districtButtons.current[index]?.focus({ preventScroll: true });
  };
  const copy =
    state.selected === null ? null : text.districtCopy[state.selected];
  const district = state.selected === null ? null : districts[state.selected];
  return (
    <section
      ref={root}
      id="digital-city"
      className={`digital-city ${copy ? 'has-selection' : ''}`}
      data-scene={failed ? 'fallback' : ready ? 'ready' : 'loading'}
      data-motion={motion && !reduced && active ? 'running' : 'paused'}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && state.selected !== null) home();
      }}
    >
      <div className="city-stage" aria-hidden="true">
        <img
          className="city-poster"
          src="/images/digital-city.svg"
          alt=""
          width="1600"
          height="1000"
          fetchPriority="high"
        />
        {mounted && !failed && (
          <SceneBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Scene
                selected={state.selected}
                expanded={state.expanded}
                moving={motion && !reduced}
                active={active}
                onSelect={(index) => dispatch({ type: 'select', index })}
                onReady={() => setReady(true)}
                onFailure={() => setFailed(true)}
              />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      <div className="city-atmosphere" />
      <div className="city-copy">
        <p className="city-eyebrow">
          <span />
          {text.eyebrow}
        </p>
        <h1>
          {text.title}
          <br />
          <span>{text.titleAccent}</span>
        </h1>
        <p className="city-intro">{text.intro}</p>
        <div className="city-actions">
          <a href="#city-districts" className="city-primary">
            {text.explore}
            <ArrowDown size={16} />
          </a>
          <button
            disabled={!mounted}
            onClick={() => dispatch({ type: 'tour' })}
          >
            {text.tour}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="city-compass" aria-hidden="true">
        <span>N</span>
        <i />
        <small>35° / SMARTSCITY</small>
      </div>
      <div className="city-tools">
        {copy && (
          <button onClick={home}>
            <ArrowLeft size={15} />
            {text.overview}
          </button>
        )}
        <button
          disabled={!mounted || reduced}
          aria-label={motion ? text.pause : text.play}
          onClick={() => setMotion(!motion)}
        >
          {motion && !reduced ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>
      {copy && district && (
        <aside className="city-detail" aria-label={copy.name} key={district.id}>
          <button className="city-close" onClick={home} aria-label={text.back}>
            <X size={18} />
          </button>
          <p className="city-eyebrow">
            {text.number} / 0{state.selected! + 1} · {copy.theme}
          </p>
          <span className="city-place">{copy.place}</span>
          <h2 ref={panelTitle} tabIndex={-1}>
            {copy.name}
          </h2>
          <h3>{copy.headline}</h3>
          <p>{copy.description}</p>
          <div className="city-tags">
            {copy.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {state.selected === 0 && (
            <>
              <button
                className="city-open"
                onClick={() => dispatch({ type: 'expand' })}
                aria-expanded={state.expanded}
              >
                <Layers size={17} />
                {state.expanded ? text.close : text.open}
                <span>↗</span>
              </button>
              {state.expanded && <LibraryExperience text={text} />}
            </>
          )}
          {state.selected === 4 && (
            <div className="city-memory">
              <small>{text.memoryNote}</small>
              <div
                className={packet ? 'memory-packet assembled' : 'memory-packet'}
              >
                {text.memoryItems.map((item, i) => (
                  <div key={item}>
                    <span>
                      0{i + 1} / {item}
                    </span>
                    <p>{text.memoryValues[i]}</p>
                  </div>
                ))}
              </div>
              <button className="city-open" onClick={() => setPacket(!packet)}>
                {packet ? text.packetReset : text.packet}
                <ArrowRight size={16} />
              </button>
              <p className="packet-status" role="status">
                {packet ? text.packetReady : text.sample}
              </p>
            </div>
          )}
          <a
            className="city-detail-link"
            href={
              state.selected === 4
                ? `/${lang}/contact/`
                : `/${lang}/projects/${district.id}/`
            }
          >
            {state.selected === 4 ? text.memoryCta : text.details}
            <ArrowUpRight size={17} />
          </a>
          {state.touring && (
            <button
              className="city-next"
              onClick={() => dispatch({ type: 'next' })}
            >
              {state.selected === 4 ? text.back : text.next}
              <ArrowRight size={16} />
            </button>
          )}
        </aside>
      )}
      <div className="city-dock" id="city-districts">
        <div className="city-dock-heading">
          <p>{text.select}</p>
          <span>{failed ? text.fallback : text.concept}</span>
        </div>
        <nav aria-label={text.districts}>
          {text.districtCopy.map((item, index) => (
            <button
              ref={(el) => {
                districtButtons.current[index] = el;
              }}
              key={item.name}
              disabled={!mounted}
              aria-pressed={state.selected === index}
              onClick={() => dispatch({ type: 'select', index })}
            >
              <span className="district-number">0{index + 1}</span>
              <span>
                <small>{item.theme}</small>
                <strong>{item.name}</strong>
              </span>
              <ArrowUpRight size={15} />
            </button>
          ))}
        </nav>
        <noscript>
          <p>
            {text.fallback} <a href="#projects">{text.details} →</a>
          </p>
        </noscript>
      </div>
    </section>
  );
}
