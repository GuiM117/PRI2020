<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
        
    <xsl:template match="/">
        <xsl:result-document href="files/index.html">
            <html>
                <head>
                    <title>Sitios Arqueológicos</title>
                </head>
                <body>
                    <h1>Sitios Arqueológicos</h1>
                    <center>
                        <hr width="80%" align="left"/>
                    </center>
                    <ul>
                        <xsl:apply-templates mode="indice" select="//ARQELEM">
                            <xsl:sort select="IDENTI"/>
                            </xsl:apply-templates>
                    </ul>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
    </xsl:template>
    <!-- :::::::::::::::::::::::::::::::::::::::Templates para o indice ::::::::::::::::::::::::::::::::::::::::::::-->
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <a name="i{generate-id()}"/> <!-- gerada para ao voltar saber onde se estava -->
            <a href="{generate-id()}.html" style="font-size:20px">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    <!-- :::::::::::::::::::::::::::::::::::::::Templates para o Conteudo ::::::::::::::::::::::::::::::::::::::::::::-->
    <xsl:template match="ARQELEM">
        <xsl:result-document href="files/{generate-id()}.html">
            <html>
                <head>
                    <title><xsl:value-of select="IDENTI"/></title>
                </head>
                <body>
                    <center>
                        <hr width="100%"/>
                    </center>
                    <a name="{generate-id()}"/>
                    <p><b>Nome</b>:<xsl:value-of select="IDENTI"/></p>
                    <p><b>Freguesia</b>:<xsl:value-of select="FREGUE"/></p>
                    <p><b>Concelho</b>:<xsl:value-of select="CONCEL"/></p>
                    <p><b>Altitude</b>:<xsl:value-of select="ALTITU"/></p>
                    <p><b>Acesso</b>:<xsl:value-of select="ACESSO"/></p>
                    <center>
                        <hr width="100%"/>
                    </center>
                    <address align="center">[<a href="index.html#i{generate-id()}">Voltar ao Indice</a>]</address>
                    <center>
                        <hr width="100%"/>
                    </center>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
</xsl:stylesheet>