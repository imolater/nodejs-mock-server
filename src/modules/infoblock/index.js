import { Module }           from '~/classes/module';
import { InfoBlock }        from '~/modules/infoblock/classes/info-block';
import {
    MODULE_ID,
    INFOBLOCKS_TABLE_NAME,
    SECTIONS_TABLE_NAME,
    ELEMENTS_TABLE_NAME,
}                           from '~/modules/infoblock/constants';
import { Random }           from '~/classes/random';
import { InfoBlockSection } from '~/modules/infoblock/classes/info-block-section';
import { InfoBlockElement } from '~/modules/infoblock/classes/info-block-element';

class InfoBlockModule extends Module {
    async init( items = [] ) {
        for ( const item of items ) {
            const { title, code, ...options } = item;
            const infoBlock = new InfoBlock( {
                title,
                code,
            } );

            InfoBlock.addItem( infoBlock );
            this._fillInfoBlock( infoBlock, options );
        }
    }

    _fillInfoBlock( infoBlock, options = {} ) {
        const {
            depth = 0,
            maxDepth = 0,
            sectionId = null,
            sectionCount = [ 1, 10 ],
            elementCount = [ 1, 10 ],
            section: Section = InfoBlockSection,
            element: Element = InfoBlockElement,
            sections = [],
            elements = [],
        } = options;

        const sectionLength = Array.isArray( sectionCount )
            ? Random.integer( ...sectionCount )
            : sectionCount;

        for ( let i = 0; i < sectionLength; i++ ) {
            const id = InfoBlockSection.addItem( new Section( {
                infoBlockId: infoBlock.id,
                infoBlockCode: infoBlock.code,
                sectionId,
                depth,
            } ) );

            if ( depth < maxDepth ) {
                this._fillInfoBlock( infoBlock, {
                    ...options,
                    depth: depth + 1,
                    sectionId: id,
                } );
            }
        }

        const itemLength = Array.isArray( elementCount )
            ? Random.integer( ...elementCount )
            : elementCount;

        for ( let i = 0; i < itemLength; i++ ) {
            InfoBlockElement.addItem( new Element( {
                infoBlockId: infoBlock.id,
                infoBlockCode: infoBlock.code,
                sectionId,
                depth,
            } ) );
        }

        if ( depth === 0 ) {
            sections.forEach( section => InfoBlockSection.addItem( new Section( {
                infoBlockId: infoBlock.id,
                infoBlockCode: infoBlock.code,
                ...section,
            } ) ) );
            elements.forEach( element => InfoBlockElement.addItem( new Element( {
                infoBlockId: infoBlock.id,
                infoBlockCode: infoBlock.code,
                ...element,
            } ) ) );
        }
    }
}

export const module = new InfoBlockModule( MODULE_ID, [
    INFOBLOCKS_TABLE_NAME,
    SECTIONS_TABLE_NAME,
    ELEMENTS_TABLE_NAME,
] );
