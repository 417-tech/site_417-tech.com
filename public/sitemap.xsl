<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
  <html>
  <head>
    <title>Sitemap</title>
    <link rel="stylesheet" href="/sitemap.css"/>
  </head>
  <body>
    <h1>Sitemap</h1>
    <table>
      <tr><th>URL</th></tr>
      <xsl:for-each select="sitemap:urlset/sitemap:url | sitemap:sitemapindex/sitemap:sitemap">
        <tr>
          <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
        </tr>
      </xsl:for-each>
    </table>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>
