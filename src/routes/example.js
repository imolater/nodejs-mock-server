import { InfoBlockElement } from '~/modules/infoblock/classes/info-block-element';

export default {
    '/shops/list/': ( req, res ) => {
        const result = InfoBlockElement.getItems( {
            filter: item => item.infoBlockCode === 'shops',
        } );

        res.success( result );
    },
};
