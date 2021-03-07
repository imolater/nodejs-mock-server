import { Entity }                from '~/classes/entity';
import { MODULE_ID, TABLE_NAME } from '~/modules/user/constants';

export class User extends Entity {
    static MODULE_ID = MODULE_ID;
    static TABLE_NAME = TABLE_NAME;
}
