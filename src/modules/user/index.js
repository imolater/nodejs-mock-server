import { Module } from '~/classes/module';
import {
    MODULE_ID,
    TABLE_NAME,
}                 from '~/modules/user/constants';

class UserModule extends Module {}

export const module = new UserModule( MODULE_ID, [ TABLE_NAME ] );
