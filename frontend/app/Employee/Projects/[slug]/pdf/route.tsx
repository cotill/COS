import { createClient } from "@/utils/supabase/server";
import { Project } from "@/utils/types";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, renderToStream } from '@react-pdf/renderer';
import { NextResponse } from "next/server";

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

export async function GET(request: Request, { params }: {params :Promise<{slug : string}>}) {
    const projectId = parseInt((await params).slug)

    const supabase = createClient();

    const { data, error } = await (await supabase)
        .from("Projects")
        .select("*")
        .eq('"project_id"',projectId)
        .single();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }));
    }
    const project = data as Project;

    const stream = await renderToStream(<MyDocument />);
    return new NextResponse(stream as unknown as ReadableStream);
}
