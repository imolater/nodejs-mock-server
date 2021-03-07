import { Entity }                           from '~/classes/entity';
import { MODULE_ID, INFOBLOCKS_TABLE_NAME } from '~/modules/infoblock/constants';
import { InfoBlockSection }                 from '~/modules/infoblock/classes/info-block-section';
import { InfoBlockElement }                 from '~/modules/infoblock/classes/info-block-element';
import { RequestError }                     from '~/classes/error';

export class InfoBlock extends Entity {
    static MODULE_ID = MODULE_ID;
    static TABLE_NAME = INFOBLOCKS_TABLE_NAME;

    static handleRequest( options = {} ) {
        const {
            menu,
            sections,
            elements,
        } = options;

        const entity = InfoBlock.search( options );

        if ( !entity ) {
            throw new RequestError( 'Not Found', 404 );
        }

        const result = {
            type: undefined,
            infoBlockId: undefined,
            sectionId: undefined,
            meta: {
                h1: entity.title,
                title: entity.title,
                description: 'Описание',
            },
            content: undefined,
        };

        if ( entity instanceof InfoBlockElement ) {
            result.type = 'element';
            result.infoBlockId = entity.infoBlockId;
            result.sectionId = entity.sectionId;
            result.content = { ...entity };
        } else {
            result.type = 'section';
            result.content = {};

            if ( entity instanceof InfoBlockSection ) {
                result.infoBlockId = entity.infoBlockId;
                result.sectionId = entity.id;
            } else {
                result.infoBlockId = entity.id;
                result.sectionId = null;
            }

            if ( sections ) {
                const { page, limit, includeSubsections } = sections;
                const subsections = [ result.sectionId ];

                result.content.sections = InfoBlockSection.getItems( {
                    page,
                    limit,
                    filter: item => {
                        if ( item.infoBlockId === result.infoBlockId ) {
                            if ( subsections.includes( item.sectionId ) ) {
                                if ( includeSubsections ) {
                                    subsections.push( item.id );
                                }

                                return true;
                            }
                        }
                    },
                } );
            }

            if ( elements ) {
                const { page, limit, includeSubsections } = elements;
                const subsections = [ result.sectionId ];

                result.content.elements = InfoBlockElement.getItems( {
                    page,
                    limit,
                    filter: item => {
                        if ( item.infoBlockId === result.infoBlockId ) {
                            if ( subsections.includes( item.sectionId ) ) {
                                if ( includeSubsections ) {
                                    subsections.push( item.id );
                                }

                                return true;
                            }
                        }
                    },
                } );
            }
        }

        if ( menu ) {
            // const { page, limit, includeSubsections } = menu;
            const subsections = [ result.sectionId ];

            result.menu = InfoBlockSection.getItems( {
                filter: item => {
                    if ( item.infoBlockId === result.infoBlockId ) {
                        if ( subsections.includes( item.sectionId ) ) {
                            subsections.push( item.id );
                            return true;
                        }
                    }
                },
            } );
        }

        return result;
    }

    static search( options = {} ) {
        const { sefMode, infoBlockCode } = options;

        const { items: [ ib ] } = InfoBlock.getItems( {
            filter: item => item.code === infoBlockCode,
        } );

        if ( !ib ) return;

        const infoBlock = new InfoBlock( ib );

        if ( sefMode ) {
            const { path } = options;
            const startSlice = ( path[0] === '/' ) ? 1 : undefined;
            const endSlice = ( path[path.length - 1] === '/' ) ? -1 : undefined;
            const parts = [];

            parts.push( ...path.slice( startSlice, endSlice ).split( '/' ) );
            parts.splice( 0, 1 );

            if ( parts.length ) {
                return find( infoBlock.id, parts );
            } else {
                return infoBlock;
            }
        } else {
            const { sectionId, elementId } = options;

            if ( sectionId !== null && elementId === null ) {
                const { items: [ section ] } = InfoBlockSection.getItems( {
                    filter: item =>
                        item.infoBlockId === infoBlock.id &&
                        item.id === sectionId,
                } );

                return new InfoBlockSection( section );
            } else if ( elementId !== null ) {
                const { items: [ element ] } = InfoBlockElement.getItems( {
                    filter: item =>
                        item.infoBlockId === infoBlock.id &&
                        item.sectionId === sectionId &&
                        item.id === elementId,
                } );

                return new InfoBlockElement( element );
            } else {
                return infoBlock;
            }
        }

        function find( infoBlockId, parts, depth = 0 ) {
            const { items: [ section ] } = InfoBlockSection.getItems( {
                filter: item =>
                    item.infoBlockId === infoBlockId &&
                    item.depth === depth &&
                    item.code === parts[depth],
            } );

            if ( section ) {
                if ( depth === ( parts.length - 1 ) ) {
                    return new InfoBlockSection( section );
                } else {
                    return find( infoBlockId, parts, depth + 1 );
                }
            }

            const { items: [ element ] } = InfoBlockElement.getItems( {
                filter: item =>
                    item.infoBlockId === infoBlockId &&
                    item.depth === depth &&
                    item.code === parts[depth],
            } );

            if ( element ) {
                return new InfoBlockElement( element );
            }
        }
    }
}
