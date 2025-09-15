import { Document, Text, Page, View, StyleSheet } from "@react-pdf/renderer";
import { Cliente } from "../../interfaces/reminders.interface";

interface PdfProps {
  sending: Cliente[];
  notsending: Cliente[];
}

const PAGE_SIZE = 30;

export const PdfReminders: React.FC<PdfProps> = ({ sending, notsending }) => {
  const now = new Date().toLocaleString("es-MX");

  // Función para dividir en páginas
  const paginate = (items: Cliente[], pageSize: number) => {
    const pages: Cliente[][] = [];
    for (let i = 0; i < items.length; i += pageSize) {
      pages.push(items.slice(i, i + pageSize));
    }
    return pages;
  };

  const sendingPages = paginate(sending, PAGE_SIZE);
  const notsendingPages = paginate(notsending, PAGE_SIZE);
  const totalPages = Math.max(sendingPages.length, notsendingPages.length);

  const styles = StyleSheet.create({
    page: {
      padding: 20,
      flexDirection: "column",
      fontSize: 10,
      fontFamily: "Helvetica",
    },
    section: {
      marginBottom: 10,
    },
    title: {
      textAlign: "center",
      fontSize: 14,
      fontWeight: 700,
      marginBottom: 5,
    },
    subtitle: {
      textAlign: "center",
      fontSize: 10,
      marginBottom: 10,
    },
    column: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    table: {
      width: "48%",
      padding: 3,
      border: "1px solid #ccc",
      borderRadius: 3,
      minHeight: 300,
    },
    rowtable: {
      flexDirection: "row",
      backgroundColor: "#4682B4",
      paddingVertical: 4,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
    },
    row: {
      flexDirection: "row",
      borderBottom: "1px solid #ccc",
      marginTop: 2,
      paddingVertical: 3,
      paddingHorizontal: 2,
    },
    header: {
      textAlign: "center",
      fontWeight: 800,
      color: "#4682B4",
      marginVertical: 3,
      fontSize: 12,
    },
    headerid: {
      width: "10%",
      textAlign: "center",
      color: "white",
      fontWeight: 700,
    },
    headername: {
      width: "60%",
      textAlign: "center",
      color: "white",
      fontWeight: 700,
    },
    headertelefono: {
      width: "30%",
      textAlign: "center",
      color: "white",
      fontWeight: 700,
    },
    cellid: {
      width: "10%",
      textAlign: "center",
      color: "#4682B4",
    },
    cellname: {
      width: "60%",
      textAlign: "left",
      color: "#4682B4",
    },
    celltelefono: {
      width: "30%",
      textAlign: "right",
      color: "#4682B4",
    },
    totals: {
      marginTop: 15,
      fontSize: 10,
      textAlign: "left",
    },
    footer: {
      textAlign: "right",
      fontSize: 8,
      marginTop: 10,
      borderTop: "1px solid #ccc",
      paddingTop: 5,
    },
  });

  return (
    <Document>
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <Page size="LETTER" style={styles.page} key={pageIndex}>
          <View style={styles.section}>
            <Text style={styles.title}>Lista de recordatorios</Text>
            <Text style={styles.subtitle}>Fecha de creación: {now}</Text>
          </View>

          <View style={styles.column}>
            {/* Enviados */}
            <View style={styles.table}>
              <Text style={styles.header}>Enviados</Text>
              <View style={styles.rowtable}>
                <Text style={styles.headerid}>Id</Text>
                <Text style={styles.headername}>Nombre</Text>
                <Text style={styles.headertelefono}>Teléfono</Text>
              </View>
              {(sendingPages[pageIndex] || []).map((cliente, index) => (
                <View key={`sent-${pageIndex}-${index}`} style={styles.row}>
                  <Text style={styles.cellid}>{pageIndex * PAGE_SIZE + index + 1}</Text>
                  <Text style={styles.cellname}>{cliente.nombre}</Text>
                  <Text style={styles.celltelefono}>{cliente.telefono}</Text>
                </View>
              ))}
            </View>

            {/* No enviados */}
            <View style={styles.table}>
              <Text style={styles.header}>No enviados</Text>
              <View style={styles.rowtable}>
                <Text style={styles.headerid}>Id</Text>
                <Text style={styles.headername}>Nombre</Text>
                <Text style={styles.headertelefono}>Teléfono</Text>
              </View>
              {(notsendingPages[pageIndex] || []).map((cliente, index) => (
                <View key={`notsent-${pageIndex}-${index}`} style={styles.row}>
                  <Text style={styles.cellid}>{pageIndex * PAGE_SIZE + index + 1}</Text>
                  <Text style={styles.cellname}>{cliente.nombre}</Text>
                  <Text style={styles.celltelefono}>{cliente.telefono}</Text>
                </View>
              ))}
            </View>
          </View>

          {pageIndex === totalPages - 1 && (
            <View style={styles.totals}>
              <Text>Total enviados: {sending.length}</Text>
              <Text>Total no enviados: {notsending.length}</Text>
              <Text>Total general: {sending.length + notsending.length}</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text
              render={() =>
                `Página ${pageIndex + 1} de ${totalPages}`
              }
              fixed
            />
          </View>
        </Page>
      ))}
    </Document>
  );
};