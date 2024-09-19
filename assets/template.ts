import type { Db } from 'mongodb'

/**
 * This function is called when the migration is run.
 * @param _db The mongodb database object that's passed to the migration
 */
export const migrate = async (_db: Db): Promise<void> => {
	// Migration code here
}
