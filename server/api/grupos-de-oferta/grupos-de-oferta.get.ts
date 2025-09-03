import getDbPool from "../../db";

export default defineEventHandler(async () => {
    const pool = await getDbPool();
    const { rows } = await pool.query(`
        SELECT
            go.*,
            COALESCE(
                ARRAY_AGG(gos.segmento_id) FILTER (WHERE gos.segmento_id IS NOT NULL),
                ARRAY[]::INTEGER[]
            ) AS segmentos_id
        FROM
            "GrupoDeOferta" AS go
        LEFT JOIN
            "GrupoDeOferta_Segmento" AS gos ON go.id = gos.grupodeoferta_id
        GROUP BY
            go.id
        ORDER BY
            go.id
    `);

    return rows;
});
