<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    
    <xsl:template match="/">
        
        <!--                                      INDICE                                 -->
        
        <xsl:result-document href="arqWeb/index.html">
            
            <html>
                <head>
                    <title>Arquissitios do NW Português</title>
                </head>
                <body>
                    <h3>Indice de arquisitios</h3>
                    <ul>
                        <xsl:apply-templates select="//ARQELEM[not(CONCEL=preceding::CONCEL)]"> <!-- se ja foi visitado -->
                            <xsl:sort select="CONCEL"/> <!-- cumprir a ordenação por ordem alfabetica-->
                        </xsl:apply-templates>
                    </ul>
                </body>
            </html>
            
        </xsl:result-document>
        
        <!--                       Criação de uma pagina para cada um dos CONTEUDOS                       -->
        
        <xsl:apply-templates select="//ARQELEM" mode="cadaIDENTI"/>
        
    </xsl:template>
    
    <xsl:template match="ARQELEM">
        <xsl:variable name="c" select="CONCEL"/>
        <!-- sublista com os ARQELEMS do concelho pelo identificador -->
        <li>
            <xsl:value-of select="CONCEL"/>
            <ul>
                <xsl:apply-templates select="//ARQELEM[CONCEL=$c]" mode="subindice"> <!-- para cada ARQELEM fazer travessia ao dataset mas apenas deste concelho c -->
                    <xsl:sort select="normalize-space(IDENTI)"/>  <!-- normalize-space(IDENTI) para normalizar os espaços-->                  
                </xsl:apply-templates>
            </ul>
        </li>
    </xsl:template>
    
    <xsl:template match="ARQELEM" mode="subindice">
        <li>
            <!-- criar links -->
            <a href="arq{position()}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    <!--                         TEMPLATE para a tratação do CONTEUDO                       -->
    
    <xsl:template match="ARQELEM" mode="cadaIDENTI">
        <xsl:result-document href="arqWeb/arq{position()}.html">
            
            <html>
                <head>
                    <title><xsl:value-of select="IDENTI"/></title>
                </head>
                <body>
                    <!-- varrer todos os filhos do arqelem que entrei com foreach -->
                    <dl>
                        <xsl:for-each select="./*">
                            <dt><xsl:value-of select="name(.)"/></dt>  <!-- o ponto quer dizer aplicado ao nodo corrente -->
                            <dd><xsl:value-of select="."/></dd>
                        </xsl:for-each>
                    </dl>
                    <adress>
                        [<a href="index.html">Voltar ao Indice</a>]
                    </adress>
                </body>
            </html>
            
        </xsl:result-document>
    </xsl:template>
</xsl:stylesheet>