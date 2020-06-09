const {Spanner} = require('@google-cloud/spanner');
const spanner =new Spanner();

const instance =spanner.instance(process.env.DB_INSTANCE_ID);
const database=spanner.database(process.env.DB_DATABASE_ID);




/**
 * Function to exit instance.
 *
 */
export function Exists()
{
    return instance.exists();
}

/**
 * Function to run query.
 *
 * @param {object} sql
 * @param {object} params
 */
export async function Run(sql,params)
{
    const query={
        sql:sql,
        params:params,
        json:true
    }
    const result=await database.run(query);
    
    return result;
}

export async function RunTransaction(sql, params) {
      try {
      await database.runTransactionAsync(async (transaction) => {
            const result=await transaction.run({sql: sql,params: params});
            const transTime=await transaction.commit();
            return result;
        });
      } catch (err) {
          // Log error
      }
  }
