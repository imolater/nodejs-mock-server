import { InfoBlockElement } from '~/modules/infoblock/classes/info-block-element';

const { items: shops } = InfoBlockElement.getItems( {
    limit: 12,
    filter: item => item.infoBlockCode === 'shops',
} );

export default shops;
