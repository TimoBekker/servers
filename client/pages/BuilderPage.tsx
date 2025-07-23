import { BuilderPage } from '@/components/BuilderPage';
import { useParams } from 'react-router-dom';

export default function BuilderPageRoute() {
  const params = useParams();
  const path = params['*'] || '';
  
  return <BuilderPage urlPath={`/${path}`} />;
}
