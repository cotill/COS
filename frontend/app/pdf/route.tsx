"use client"
import { Project } from "@/utils/types";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, renderToFile, renderToStream } from '@react-pdf/renderer';
import { NextResponse } from "next/server";
import { data } from "autoprefixer";
import { createClient } from "@/utils/supabase/client";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export async function POST(req: Request) {
  const reqBody = await req.json();
  const {project_id} = reqBody;
  
  const supabase =  createClient();
    

    const { data, error } = await ( supabase)
        .from("Projects")
        .select("*")
        .eq('"project_id"', project_id)
        .single();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }));
    }
    const project = data as unknown as Project;

    // return new Response(JSON.stringify({ data: project }));


    // await renderToFile(<MyDocument />, "/test.pdf") 
    // // console.log(stream)
    // // return new NextResponse(stream as unknown as ReadableStream);
    // return new Response(JSON.stringify({ data: project_id }));

    const pdfStream = await renderToStream(
      <Document>
        <Page size="A4">
          <Text>Project ID: {project_id}</Text>
          <Text>Project Name: {data.project_name}</Text>
        </Page>
      </Document>
    );
  
    return new Response(pdfStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Project-${project_id}.pdf"`,
      },
    });
  }
