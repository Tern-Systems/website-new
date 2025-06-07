using btmc.src.alu;
using btmc.src.ui.forms.main.components;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using toolbox = btmc.src.ui.resources.toolbox;

namespace btmc.src.ui.forms.main.tabs.T_BTMC
{
    using TypeEntry = KeyValuePair<Utils.TypeEnum, string>;

    /// <summary>
    /// Interaction logic for BTMC.xaml
    /// </summary>
    public partial class BTMC : UserControl
    {
        public Converter.TypeDict Types { get; }
        public BTMC()
        {
            InitializeComponent();
            Types = Converter.Type;
            DataContext = this;
        }

        private void RemovePlaceholder(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox textBox &&
                (textBox.Text == "input..." || textBox.Text == "output..."))
            {
                textBox.Text = "";
                textBox.Foreground = Brushes.White;
            }
        }

        private void RestorePlaceholder(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox textBox && string.IsNullOrWhiteSpace(textBox.Text))
            {
                textBox.Text = textBox.Name.Contains("Input") ? "input..." : "output...";
                textBox.Foreground = new SolidColorBrush(Color.FromRgb(179, 179, 179));
            }
        }

        public void ClearFields()
        {
            InputTextBox.Text = string.Empty;
            OutputTextBox.Text = string.Empty;
            RestorePlaceholder(InputTextBox, null);
            RestorePlaceholder(OutputTextBox, null);
            if (InputComboBox != null) InputComboBox.SelectedIndex = 0;
            if (OutputComboBox != null) OutputComboBox.SelectedIndex = 0;
        }

        private void BtnSwap_Click(object sender, RoutedEventArgs e)
        {
            var temp = InputTextBox.Text;
            InputTextBox.Text = OutputTextBox.Text;
            OutputTextBox.Text = temp;
        }
        private void CmbTypeIn_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            /* Uncomment after you add the required components to the form */
            //_HandleSelectionChanged(ref cmbBTMC_Out, ref cmbBTMC_In, ref tbBTMC_In);
        }
        private void CmbTypeOut_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            /* Uncomment after you add the required components to the form */
            //_HandleSelectionChanged(ref cmbBTMC_In, ref cmbBTMC_Out, ref tbBTMC_Out);
        }
        private void _HandleSelectionChanged(ref toolbox.ComboBox cmb0, ref toolbox.ComboBox cmb1, ref toolbox.TextBox tb)
        {
            // Implement it
        }
    }
}
