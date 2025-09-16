import getDbPool from "../../db"

export default defineEventHandler(async () => {
    const pool = await getDbPool();
    const { rows } = await pool.query(`
        SELECT
            dh.*,
            COALESCE(
                ARRAY_AGG(dhs.segmento_id) FILTER (WHERE dhs.segmento_id IS NOT NULL),
                ARRAY[]::INTEGER[]
            ) AS segmentos_id
        FROM
            destino_home AS dh
        LEFT JOIN
            destino_home_segmentos AS dhs ON dh.id = dhs.destino_home_id
        GROUP BY
            dh.id
        ORDER BY
            dh.id
    `);

    return rows;
});