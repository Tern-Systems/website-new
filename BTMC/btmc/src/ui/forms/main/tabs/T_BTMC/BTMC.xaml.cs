using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Linq;
using System.Text.RegularExpressions;

using btmc.src.alu;
using toolbox = btmc.src.ui.resources.toolbox;
using btmc.src.ui.forms.main.components;

namespace btmc.src.ui.forms.main.tabs.T_BTMC
{
    using TypeEntry = KeyValuePair<Utils.TypeEnum, string>;
    using CustomComboBox = toolbox.CComboBox.CustomComboBox;

    public partial class BTMC : UserControl
    {
        public Converter.TypeDict Types { get; }

        public List<string> TypeNames =>
            new[] { "Select..." }.Concat(Types.ConvertAll(entry => entry.Value)).ToList();

        private bool _inputWasEmptyWhenTypeChanged = false;

        public BTMC()
        {
            Types = Converter.Type;
            InitializeComponent();
            DataContext = this;

            cmbBTMC_In.ItemsSource = TypeNames;
            cmbBTMC_Out.ItemsSource = TypeNames;
            cmbBTMC_In.SelectedIndex = 0;
            cmbBTMC_Out.SelectedIndex = 0;

            InputTextBox.TextChanged += InputTextBox_TextChanged;
            cmbBTMC_In.DropDownOpened += (s, e) =>
            {
                _inputWasEmptyWhenTypeChanged = string.IsNullOrWhiteSpace(InputTextBox.Text) || InputTextBox.Text == "input...";
            };

            InputTextBox.BorderBrush = Brushes.White;
        }

        private void BtnSwap_Click(object sender, RoutedEventArgs e)
        {
            Swap.SwapInputs(InputTextBox, OutputTextBox);
        }

        private void CmbTypeIn_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            HandleSelectionChanged(cmbBTMC_Out, cmbBTMC_In, InputTextBox);

            if (_inputWasEmptyWhenTypeChanged)
            {
                _inputWasEmptyWhenTypeChanged = false;
                InputTextBox.BorderBrush = Brushes.White;
                return;
            }

            ValidateInput();
        }

        private void CmbTypeOut_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            HandleSelectionChanged(cmbBTMC_In, cmbBTMC_Out, OutputTextBox);
        }

        private static void HandleSelectionChanged(
            CustomComboBox otherCombo,
            CustomComboBox changedCombo,
            TextBox relatedTextbox)
        {
            if (otherCombo != null && changedCombo != null && relatedTextbox != null)
            {
                if (otherCombo.SelectedValue?.Equals(changedCombo.SelectedValue) == true &&
                    changedCombo.SelectedIndex > 0)
                {
                    otherCombo.SelectedIndex = 0;
                }
            }
        }

        private void InputTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(InputTextBox.Text) || InputTextBox.Text == "input...")
            {
                InputTextBox.BorderBrush = Brushes.White;
                return;
            }

            ValidateInput();
        }

        private void ValidateInput()
        {
            string input = InputTextBox.Text?.Trim();

            if (string.IsNullOrWhiteSpace(input) || input == "input...")
            {
                InputTextBox.BorderBrush = Brushes.White;
                return;
            }

            if (cmbBTMC_In.SelectedIndex <= 0)
            {
                InputTextBox.BorderBrush = Brushes.White;
                return;
            }

            var selectedTypeName = cmbBTMC_In.SelectedItem as string;
            var selectedType = Types.FirstOrDefault(x => x.Value == selectedTypeName).Key;

            if (!Utils.TypePattern.TryGetValue(selectedType, out var patternEntry))
            {
                InputTextBox.BorderBrush = Brushes.White;
                return;
            }

            string rawPattern = patternEntry.regex;
            short? maxLength = patternEntry.length;

            try
            {
                var regex = new Regex(rawPattern);

                if (!regex.IsMatch(input))
                {
                    InputTextBox.BorderBrush = Brushes.Red;
                    return;
                }

                if (maxLength.HasValue && input.Length > maxLength.Value)
                {
                    InputTextBox.BorderBrush = Brushes.Red;
                    return;
                }

                InputTextBox.BorderBrush = Brushes.White;
            }
            catch
            {
                InputTextBox.BorderBrush = Brushes.White;
            }
        }
    }
}
