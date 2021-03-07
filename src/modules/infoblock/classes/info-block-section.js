import { Entity }   from '~/classes/entity';
import {
    MODULE_ID,
    SECTIONS_TABLE_NAME,
}                   from '~/modules/infoblock/constants';
import { MockData } from '~/modules/mock-data/classes/mock-data';

export class InfoBlockSection extends Entity {
    static MODULE_ID = MODULE_ID;
    static TABLE_NAME = SECTIONS_TABLE_NAME;

    constructor( options = {} ) {
        super( options );

        const {
            infoBlockId,
            infoBlockCode,
            sectionId = null,
            depth = 0,
            previewImage = MockData.image( 1, { nullable: true } ),
            detailImage = previewImage,
            previewText = MockData.paragraph( 6, { nullable: true } ),
            detailText = previewText,
        } = options;

        let parentUrl;

        if ( sectionId !== null ) {
            const { items: [ parent ] } = InfoBlockSection.getItems( {
                filter: item => item.id === sectionId,
            } );

            parentUrl = parent.url;
        } else {
            parentUrl = `/${ infoBlockCode }/`;
        }
        const url = `${ parentUrl }${ this.code }/`;

        Object.assign( this, {
            infoBlockId,
            infoBlockCode,
            url,
            sectionId,
            depth,
            previewImage,
            detailImage,
            detailText,
            previewText,
        } );
    }
}
